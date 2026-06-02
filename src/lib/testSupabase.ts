import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errorUtils";
import type { UserRole } from "@/types/app";

/**
 * Comprehensive Supabase connection and configuration test
 * 
 * Usage:
 * 1. In browser console: import('./lib/testSupabase').then(m => m.testSupabase())
 * 2. Or just run: testSupabase() (auto-exposed to window)
 */
export async function testSupabase() {
  console.log("🔍 Quantix Studio — Supabase Configuration Test\n");
  console.log("=".repeat(60));

  // Test 1: Client Initialization
  console.log("\n✅ Test 1: Client Initialization");
  console.log("   Client configured:", !!supabase);

  // Test 2: Database Connection
  console.log("\n🔄 Test 2: Database Connection");
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);
    
    if (error) throw error;
    console.log("   ✅ Database connection successful");
  } catch (error) {
    console.error("   ❌ Database connection failed:", getErrorMessage(error));
    return;
  }

  // Test 3: Authentication Status
  console.log("\n🔄 Test 3: Authentication Status");
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log("   ✅ User authenticated");
      console.log("   Email:", session.user.email);
      console.log("   User ID:", session.user.id);
    } else {
      console.log("   ⚠️  No active session (user not logged in)");
      console.log("   Note: Some tests require authentication");
      return;
    }
  } catch (error) {
    console.error("   ❌ Auth check failed:", getErrorMessage(error));
    return;
  }

  // Test 4: Profile Access (RLS Check)
  console.log("\n🔄 Test 4: Profile Access (RLS)");
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      console.log("   ✅ Profile access successful");
      console.log("   Name:", data.full_name || "Not set");
      console.log("   Email:", data.email);
    }
  } catch (error) {
    console.error("   ❌ Profile access failed:", getErrorMessage(error));
  }

  // Test 5: Role System Check
  console.log("\n🔄 Test 5: Role System (RBAC)");
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      
      if (error) {
        console.log("   ⚠️  user_roles table not accessible:", error.message);
      } else if (roleData && roleData.length > 0) {
        console.log("   ✅ Roles found:");
        roleData.forEach((role: Pick<UserRole, "role">) => console.log("      -", role.role));
        
        // Test has_role() function
        const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
        
        if (!roleError) {
          console.log("   has_role('admin'):", isAdmin ? "✅ Yes" : "❌ No");
        }
      } else {
        console.log("   ⚠️  No roles assigned to user");
        console.log("   Action: Trigger should assign 'user' role on signup");
      }
    }
  } catch (error) {
    console.error("   ❌ Role check failed:", getErrorMessage(error));
  }

  // Test 6: Security Verification
  console.log("\n🔄 Test 6: Security Verification");
  try {
    const { data: profilesTable } = await supabase
      .from("profiles")
      .select("*")
      .limit(1);
    
    // Check if role column exists in response
    if (profilesTable && profilesTable.length > 0) {
      const hasRoleColumn = "role" in profilesTable[0];
      if (hasRoleColumn) {
        console.log("   ⚠️  WARNING: 'role' column still exists in profiles table");
        console.log("   Action: Run migration to remove privilege escalation vulnerability");
      } else {
        console.log("   ✅ Secure: 'role' column removed from profiles");
      }
    }
  } catch (error) {
    console.error("   ❌ Security check failed:", getErrorMessage(error));
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Supabase configuration test complete!\n");
}

declare global {
  interface Window {
    testSupabase?: typeof testSupabase;
  }
}

// Auto-expose to window for easy console access
if (typeof window !== "undefined") {
  window.testSupabase = testSupabase;
  console.log("💡 Tip: Run 'testSupabase()' in console to check configuration");
}

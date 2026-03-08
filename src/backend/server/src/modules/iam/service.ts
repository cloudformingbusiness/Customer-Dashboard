import { supabase } from '../../lib/supabase'
import { TABLES } from '../../lib/tables'

// ── Rollen + Permissions eines Users laden ──────────────────
export async function getUserRolesAndPermissions(userId: string) {
  // User-Rollen laden
  const { data: userRoles, error: rolesError } = await supabase
    .from(TABLES.userRoles)
    .select('role_id')
    .eq('user_id', userId)

  if (rolesError) throw rolesError

  const roleIds = (userRoles ?? []).map((ur) => ur.role_id as string)

  if (roleIds.length === 0) {
    return { roles: ['viewer'], permissions: [] as string[] }
  }

  // Rollennamen laden
  const { data: roles, error: rolesNameError } = await supabase
    .from(TABLES.roles)
    .select('name')
    .in('id', roleIds)

  if (rolesNameError) throw rolesNameError

  const roleNames = (roles ?? []).map((r) => r.name as string)

  // Permissions über Role-Permissions laden
  const { data: rolePerms, error: permsError } = await supabase
    .from(TABLES.rolePermissions)
    .select('permission_id')
    .in('role_id', roleIds)

  if (permsError) throw permsError

  const permIds = (rolePerms ?? []).map((rp) => rp.permission_id as string)

  if (permIds.length === 0) {
    return { roles: roleNames.length > 0 ? roleNames : ['viewer'], permissions: [] as string[] }
  }

  const { data: perms, error: permKeysError } = await supabase
    .from(TABLES.permissions)
    .select('key')
    .in('id', permIds)

  if (permKeysError) throw permKeysError

  const permissions = (perms ?? []).map((p) => p.key as string)

  return {
    roles: [...new Set(roleNames.length > 0 ? roleNames : ['viewer'])],
    permissions: [...new Set(permissions)],
  }
}

// ── User einer Rolle zuweisen ───────────────────────────────
export async function assignRoleToUser(
  userId: string,
  roleName: string,
  organizationId?: string,
  assignedBy?: string
) {
  const { data: role, error: roleError } = await supabase
    .from(TABLES.roles)
    .select('id')
    .eq('name', roleName)
    .single()

  if (roleError || !role) throw new Error(`Rolle '${roleName}' nicht gefunden`)

  const { error } = await supabase
    .from(TABLES.userRoles)
    .upsert({
      user_id: userId,
      role_id: role.id,
      organization_id: organizationId ?? null,
      assigned_by: assignedBy ?? null,
    }, { onConflict: 'user_id,role_id,organization_id' })

  if (error) throw error

  await logAudit(assignedBy ?? userId, 'role_assigned', 'user_role', userId, null, { roleName, organizationId })
}

// ── Alle Rollen laden ───────────────────────────────────────
export async function getRoles() {
  const { data, error } = await supabase
    .from(TABLES.roles)
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

// ── Alle Permissions laden ──────────────────────────────────
export async function getPermissions() {
  const { data, error } = await supabase
    .from(TABLES.permissions)
    .select('*')
    .order('key')

  if (error) throw error
  return data
}

// ── Users mit Rollen laden ──────────────────────────────────
export async function getUsersWithRoles() {
  const { data, error } = await supabase
    .from(TABLES.userRoles)
    .select('user_id, role_id')

  if (error) throw error
  return data
}

// ── Audit Log ───────────────────────────────────────────────
export async function logAudit(
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  oldData?: unknown,
  newData?: unknown
) {
  await supabase.from(TABLES.auditLog).insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    old_data: oldData ?? null,
    new_data: newData ?? null,
  })
}

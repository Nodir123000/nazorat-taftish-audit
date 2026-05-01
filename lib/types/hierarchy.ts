/**
 * Hierarchy and Collision Detection Types
 */

export type BlockLevel = 1 | 2 | 3; // 1: warning, 2: hard block, 3: exception required

export interface AuthorityHierarchy {
  id: string | number;
  code: string;
  name: string;
  level: number; // 1: highest, 3: lowest
  priority: number;
  jurisdiction?: string;
}

export interface CollisionInfo {
  planId?: number | string;
  authority?: string | null;
  type?: string | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  control_authority_id?: number | string;
  controlAuthorityId?: number | string;
}

export interface CollisionResult {
  hasCollision: boolean;
  plans?: CollisionInfo[];
  blockLevel?: BlockLevel;
  canOverride?: boolean;
  requiredMinisterApproval?: boolean;
  conflictingPlan?: CollisionInfo;
}

export interface HardBlockResult extends CollisionResult {
  blockLevel: 3;
  canOverride: boolean;
  requiredMinisterApproval: boolean;
  conflictingPlan: CollisionInfo;
}

export interface ExceptionRequest {
  is_exceptional: boolean;
  exceptional_reason?: string;
  minister_order_ref?: string;
  minister_order_date?: string;
  override_authority_id?: number | string;
}

export interface PlanWithException {
  [key: string]: any;
  is_exceptional?: boolean;
  exceptional_reason?: string;
  minister_order_ref?: string;
  minister_order_date?: string;
  override_authority_id?: number | string;
}

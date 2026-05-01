/**
 * Hierarchy and Collision Detection Types
 */

export enum PriorityLevel {
  Master = 1,      // КРУ МО РУ - absolute authority
  Central = 2,     // Central departments (ГУБП ГШ ВС РУ, etc)
  Regional = 3,    // Military districts (ВВО, ТВО, etc),
}

export interface AuthorityHierarchy {
  authority_id: number;
  code: string;
  name: string;
  priority_level: PriorityLevel;
}

export interface CollisionDetail {
  planId: number;
  authority: AuthorityHierarchy;
  inspectionType: string;
  startDate: Date;
  endDate: Date;
  inspectionDirection?: string;
}

export interface HardBlockResult {
  hasCollision: true;
  blockLevel: "same_authority" | "lower_priority" | "conflict_period";
  conflictingPlan: CollisionDetail;
  canOverride: boolean;
  requiredMinisterApproval: boolean;
  reason: string;
  details: {
    userPriority: PriorityLevel;
    conflictPriority: PriorityLevel;
    yearOfExistingPlan: number;
  };
}

export interface CollisionCheckResult {
  hasCollision: boolean;
  block?: HardBlockResult;
  plans?: CollisionDetail[];
}

export interface ExceptionRequest {
  is_exceptional: boolean;
  exceptional_reason?: string;
  minister_order_ref?: string;
  minister_order_date?: Date;
  override_authority_id?: number;
}

// src/types/complaint.ts

export interface ComplaintRequest {
  issue_description: string;
  reporter_name?: string;
  location?: string;
  email?: string;
  issue_type?: string;
}

export type PriorityLevel = "high" | "medium" | "low" | "critical";

export interface NearbyFacility {
  name: string;
  lat: number;
  lon: number;
  type: "hospital" | "school";
}

export interface NearbyFacilities {
  hospitals: NearbyFacility[];
  schools: NearbyFacility[];
  hospital_count: number;
  school_count: number;
}

export interface ComplaintResponse {
  report_id: string;
  issue_description: string;
  location: string;
  issue_type: string;
  priority_level: PriorityLevel;
  priority_score: number;
  severity_score: number;
  area_importance: number;
  citizen_reports_count: number;
  latitude: number;
  longitude: number;
  nearby: NearbyFacilities;
}

export const ISSUE_TYPES = [
  "graffiti",
  "pothole",
  "broken_streetlight",
  "garbage",
  "water_leak",
  "illegal_dumping",
  "abandoned_vehicle",
  "noise_complaint",
  "vandalism",
  "other",
] as const;

export type IssueType = (typeof ISSUE_TYPES)[number];

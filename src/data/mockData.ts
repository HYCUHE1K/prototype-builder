// Mock data for AI Care Companion prototype

export interface CareUser {
  id: string;
  name: string;
  age: number;
  address: string;
  deviceId: string;
  status: 'normal' | 'warning' | 'critical';
  lastActive: string;
  guardians: Guardian[];
}

export interface Guardian {
  id: string;
  name: string;
  phone: string;
  relation: string;
  priority: number;
}

export interface CareEvent {
  id: string;
  userId: string;
  userName: string;
  type: 'fall' | 'inactivity' | 'emergency_button' | 'voice_distress' | 'vital_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'acknowledged' | 'escalated' | 'resolved';
  timestamp: string;
  description: string;
  caseId?: string;
}

export interface CareCase {
  id: string;
  userId: string;
  userName: string;
  events: string[];
  status: 'open' | 'in_progress' | 'escalated_119' | 'resolved';
  currentStage: number;
  createdAt: string;
  updatedAt: string;
}

export interface Measurement {
  timestamp: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  spo2: number;
  activity: number;
  temperature: number;
}

export interface PolicyBundle {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'active' | 'archived';
  thresholds: PolicyThreshold[];
  escalationPlan: EscalationStage[];
  rules: PolicyRule[];
  updatedAt: string;
}

export interface PolicyThreshold {
  id: string;
  metric: string;
  operator: '<' | '>' | '<=' | '>=' | '==';
  value: number;
  duration: number; // seconds
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface EscalationStage {
  stage: number;
  target: string;
  targetType: 'guardian' | 'caregiver' | 'center' | 'emergency';
  timeoutSec: number;
}

export interface PolicyRule {
  id: string;
  name: string;
  conditions: string;
  action: string;
  priority: number;
  enabled: boolean;
}

export interface Alert {
  id: string;
  caseId: string;
  userId: string;
  userName: string;
  stage: number;
  target: string;
  status: 'pending' | 'sent' | 'ack' | 'timeout' | 'failed';
  channel: 'push' | 'sms' | 'call';
  sentAt: string;
  respondedAt?: string;
  message: string;
}

// --- Mock Data ---

export const careUsers: CareUser[] = [
  {
    id: 'u1', name: '김영순', age: 78, address: '서울시 종로구 혜화동 123-4',
    deviceId: 'DEV-A001', status: 'normal', lastActive: '2분 전',
    guardians: [
      { id: 'g1', name: '김민수', phone: '010-1234-5678', relation: '아들', priority: 1 },
      { id: 'g2', name: '김지영', phone: '010-9876-5432', relation: '딸', priority: 2 },
    ]
  },
  {
    id: 'u2', name: '박철수', age: 82, address: '서울시 마포구 상암동 456-7',
    deviceId: 'DEV-A002', status: 'warning', lastActive: '15분 전',
    guardians: [
      { id: 'g3', name: '박현주', phone: '010-5555-1234', relation: '딸', priority: 1 },
    ]
  },
  {
    id: 'u3', name: '이순자', age: 75, address: '서울시 강남구 역삼동 789-0',
    deviceId: 'DEV-A003', status: 'critical', lastActive: '32분 전',
    guardians: [
      { id: 'g4', name: '이준혁', phone: '010-7777-8888', relation: '아들', priority: 1 },
      { id: 'g5', name: '이수연', phone: '010-3333-4444', relation: '며느리', priority: 2 },
    ]
  },
  {
    id: 'u4', name: '정복순', age: 80, address: '서울시 서초구 방배동 111-2',
    deviceId: 'DEV-A004', status: 'normal', lastActive: '5분 전',
    guardians: [
      { id: 'g6', name: '정태호', phone: '010-2222-3333', relation: '아들', priority: 1 },
    ]
  },
];

export const careEvents: CareEvent[] = [
  { id: 'e1', userId: 'u3', userName: '이순자', type: 'fall', severity: 'critical', status: 'escalated', timestamp: '14:23:05', description: '낙상 감지 - 60초 무동작 확인', caseId: 'c1' },
  { id: 'e2', userId: 'u2', userName: '박철수', type: 'vital_anomaly', severity: 'high', status: 'open', timestamp: '14:18:30', description: 'SpO2 88% - 3분 지속', caseId: 'c2' },
  { id: 'e3', userId: 'u3', userName: '이순자', type: 'voice_distress', severity: 'critical', status: 'escalated', timestamp: '14:22:10', description: '응급 키워드 감지: "살려주세요"', caseId: 'c1' },
  { id: 'e4', userId: 'u1', userName: '김영순', type: 'inactivity', severity: 'medium', status: 'resolved', timestamp: '13:45:00', description: '2시간 무활동 감지 → 활동 재개 확인' },
  { id: 'e5', userId: 'u2', userName: '박철수', type: 'vital_anomaly', severity: 'medium', status: 'acknowledged', timestamp: '14:10:15', description: '심박수 105bpm - 비정상 범위', caseId: 'c2' },
];

export const careCases: CareCase[] = [
  { id: 'c1', userId: 'u3', userName: '이순자', events: ['e1', 'e3'], status: 'escalated_119', currentStage: 4, createdAt: '14:22:10', updatedAt: '14:24:30' },
  { id: 'c2', userId: 'u2', userName: '박철수', events: ['e2', 'e5'], status: 'in_progress', currentStage: 2, createdAt: '14:10:15', updatedAt: '14:19:00' },
];

export const measurements: Measurement[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: `${String(i).padStart(2, '0')}:00`,
  systolic: 120 + Math.round(Math.sin(i / 3) * 15 + Math.random() * 8),
  diastolic: 78 + Math.round(Math.sin(i / 4) * 8 + Math.random() * 5),
  heartRate: 72 + Math.round(Math.sin(i / 2) * 12 + Math.random() * 6),
  spo2: Math.max(85, 97 - Math.round(Math.abs(Math.sin(i / 5)) * 8 + Math.random() * 3)),
  activity: Math.max(0, Math.round(Math.sin((i - 6) / 4) * 50 + 30 + Math.random() * 20)),
  temperature: 36.2 + Math.round(Math.sin(i / 6) * 0.8 * 10) / 10 + Math.round(Math.random() * 5) / 10,
}));

export const policyBundles: PolicyBundle[] = [
  {
    id: 'pb1', name: '표준 돌봄 정책 v2.1', version: '2.1', status: 'active', updatedAt: '2026-03-01',
    thresholds: [
      { id: 'pt1', metric: 'SpO2', operator: '<', value: 90, duration: 180, severity: 'critical' },
      { id: 'pt2', metric: 'HeartRate', operator: '>', value: 120, duration: 120, severity: 'high' },
      { id: 'pt3', metric: 'HeartRate', operator: '<', value: 50, duration: 120, severity: 'high' },
      { id: 'pt4', metric: 'Inactivity', operator: '>', value: 7200, duration: 0, severity: 'medium' },
      { id: 'pt5', metric: 'Temperature', operator: '>', value: 38.5, duration: 300, severity: 'high' },
    ],
    escalationPlan: [
      { stage: 1, target: '보호자 1', targetType: 'guardian', timeoutSec: 60 },
      { stage: 2, target: '보호자 2', targetType: 'guardian', timeoutSec: 90 },
      { stage: 3, target: '요양보호사', targetType: 'caregiver', timeoutSec: 120 },
      { stage: 4, target: '관제센터', targetType: 'center', timeoutSec: 60 },
    ],
    rules: [
      { id: 'pr1', name: '즉시 119 출동 - 낙상+무동작', conditions: 'fall_detected AND no_motion_60s', action: 'ESCALATE_119_IMMEDIATE', priority: 1, enabled: true },
      { id: 'pr2', name: '즉시 119 출동 - 응급 키워드', conditions: 'voice_keyword IN ["살려주세요","도와주세요","119"]', action: 'ESCALATE_119_IMMEDIATE', priority: 1, enabled: true },
      { id: 'pr3', name: '즉시 119 출동 - SpO2 위험', conditions: 'spo2 < 90 AND duration > 180s AND respiratory_distress', action: 'ESCALATE_119_IMMEDIATE', priority: 1, enabled: true },
      { id: 'pr4', name: '야간 무활동 알림 완화', conditions: 'time BETWEEN 22:00 AND 06:00', action: 'SUPPRESS_INACTIVITY_ALERT', priority: 5, enabled: true },
    ]
  },
  {
    id: 'pb2', name: '고위험군 강화 정책', version: '1.0', status: 'draft', updatedAt: '2026-02-28',
    thresholds: [
      { id: 'pt6', metric: 'SpO2', operator: '<', value: 92, duration: 120, severity: 'critical' },
      { id: 'pt7', metric: 'HeartRate', operator: '>', value: 110, duration: 60, severity: 'high' },
    ],
    escalationPlan: [
      { stage: 1, target: '보호자 1', targetType: 'guardian', timeoutSec: 30 },
      { stage: 2, target: '관제센터', targetType: 'center', timeoutSec: 30 },
    ],
    rules: []
  }
];

export const alerts: Alert[] = [
  { id: 'a1', caseId: 'c1', userId: 'u3', userName: '이순자', stage: 1, target: '이준혁 (아들)', status: 'timeout', channel: 'push', sentAt: '14:22:15', message: '⚠️ 이순자님 낙상 감지. 즉시 확인 필요.' },
  { id: 'a2', caseId: 'c1', userId: 'u3', userName: '이순자', stage: 2, target: '이수연 (며느리)', status: 'timeout', channel: 'call', sentAt: '14:23:20', message: '🚨 이순자님 응급 상황. 낙상 후 무동작 60초.' },
  { id: 'a3', caseId: 'c1', userId: 'u3', userName: '이순자', stage: 4, target: '119 응급', status: 'sent', channel: 'call', sentAt: '14:24:30', message: '🆘 즉시 119 출동 요청 - 낙상+무동작+응급키워드' },
  { id: 'a4', caseId: 'c2', userId: 'u2', userName: '박철수', stage: 1, target: '박현주 (딸)', status: 'sent', channel: 'push', sentAt: '14:18:35', message: '⚠️ 박철수님 SpO2 88% 감지. 상태 확인 요청.' },
  { id: 'a5', caseId: 'c2', userId: 'u2', userName: '박철수', stage: 2, target: '요양보호사', status: 'pending', channel: 'sms', sentAt: '14:20:05', message: '박철수님 활력징후 이상. 보호자 미응답, 확인 요청.' },
];

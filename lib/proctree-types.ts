export interface ProcTreeProps {
  // Overall
  seed?: number;
  segments?: number;
  levels?: number;
  vMultiplier?: number;

  // Twig
  twigScale?: number;

  // Branching
  initalBranchLength?: number;
  lengthFalloffFactor?: number;
  lengthFalloffPower?: number;
  clumpMax?: number;
  clumpMin?: number;
  branchFactor?: number;
  dropAmount?: number;
  growAmount?: number;
  sweepAmount?: number;

  // Trunk
  maxRadius?: number;
  climbRate?: number;
  trunkKink?: number;
  treeSteps?: number;
  taperRate?: number;
  radiusFalloffRate?: number;
  twistRate?: number;
  trunkLength?: number;
}

export const DefaultTreePartProps: ProcTreeProps = {
  seed: 256,
  segments: 6,
  levels: 5,
  vMultiplier: 2.36,
  twigScale: 0.39,
  initalBranchLength: 0.49,
  lengthFalloffFactor: 0.85,
  lengthFalloffPower: 0.99,
  clumpMax: 0.454,
  clumpMin: 0.404,
  branchFactor: 2.45,
  dropAmount: -0.1,
  growAmount: 0.235,
  sweepAmount: 0.01,
  maxRadius: 0.139,
  climbRate: 0.371,
  trunkKink: 0.093,
  treeSteps: 5,
  taperRate: 0.947,
  radiusFalloffRate: 0.73,
  twistRate: 3.02,
  trunkLength: 2.4,
};

export const DefaultRootPartProps: ProcTreeProps = {
  seed: 256,
  segments: 6,
  levels: 4,
  vMultiplier: 2.36,
  twigScale: 0,
  initalBranchLength: 0.49,
  lengthFalloffFactor: 0.7,
  lengthFalloffPower: 0.3,
  clumpMax: 0.454,
  clumpMin: 0.404,
  branchFactor: 2.45,
  dropAmount: 0.4,
  growAmount: 0.0,
  sweepAmount: 0.0,
  maxRadius: 0.139,
  climbRate: 0.371,
  trunkKink: 0.093,
  treeSteps: 10,
  taperRate: 0.947,
  radiusFalloffRate: 0.73,
  twistRate: 7.0,
  trunkLength: 0.7,
};

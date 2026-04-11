import type { ShadowAIQuestion } from '$lib/types.js';

/**
 * 8 shadow AI risk assessment questions.
 * Each question maps to a risk category and is scored 0–3 (worst → best).
 * Total max score: 24 (8 × 3).
 *
 * Question design rationale: each question targets a specific mechanism by which
 * shadow AI creates organizational risk. Help text cites confirmed 2025 statistics
 * from the IBM 2025 Cost of a Data Breach Report unless otherwise noted.
 */
export const questions: ShadowAIQuestion[] = [
	// ─── VISIBILITY ────────────────────────────────────────────────────────────

	{
		id: 'q01',
		riskCategory: 'visibility',
		text: 'How much visibility does your organization have into AI tools employees are currently using for work?',
		helpText:
			"50% of employees use unapproved AI tools without their employer's knowledge (Software AG 2024). Without a complete inventory of AI tools in use, you cannot assess data exposure, enforce policy, or respond to incidents.",
		options: [
			{
				score: 0,
				label: 'None — we have no visibility into AI tool usage across our organization'
			},
			{
				score: 1,
				label:
					'Limited — we only know about officially approved tools; shadow use is invisible to us'
			},
			{
				score: 2,
				label:
					'Partial — we learn about tools through occasional audits or voluntary employee reporting'
			},
			{
				score: 3,
				label: 'Comprehensive — we maintain a continuously updated inventory of all AI tools in use'
			}
		]
	},

	// ─── POLICY ────────────────────────────────────────────────────────────────

	{
		id: 'q02',
		riskCategory: 'policy',
		text: 'Are employees using personal AI accounts (ChatGPT, Claude, Gemini, Copilot) for work tasks?',
		helpText:
			'Personal AI accounts bypass enterprise data controls entirely. Interactions happen outside your audit trail, IP protections, and data agreements — creating exposure your organization cannot see or remediate.',
		options: [
			{
				score: 0,
				label:
					'Yes, routinely — employees use personal AI accounts for work with no restrictions or visibility'
			},
			{
				score: 1,
				label: 'Likely — we have no policy and no way to know what accounts employees are using'
			},
			{
				score: 2,
				label: 'We have a policy against it, but no enforcement mechanisms to verify compliance'
			},
			{
				score: 3,
				label:
					'Controlled — clear policy, active monitoring, and verified compliance with restrictions on personal AI use'
			}
		]
	},

	{
		id: 'q03',
		riskCategory: 'data',
		text: 'Have employees entered confidential data — customer records, source code, financial data, or HR information — into AI tools?',
		helpText:
			'Only 17% of organizations have technical controls to prevent employees from uploading confidential data to AI tools (IBM 2025). The remaining 83% rely on policy, warnings, or have no safeguards at all.',
		options: [
			{
				score: 0,
				label:
					'Yes, routinely — employees regularly enter confidential data with no restrictions or controls'
			},
			{
				score: 1,
				label:
					'Likely — we have no controls preventing confidential data from being shared with AI tools'
			},
			{
				score: 2,
				label:
					'We have guidelines prohibiting it, but lack technical controls to enforce the restriction'
			},
			{
				score: 3,
				label:
					'Controlled — both policy and technical controls (DLP, access restrictions) prevent confidential data entry'
			}
		]
	},

	{
		id: 'q04',
		riskCategory: 'policy',
		text: 'Does your organization have a written policy governing employee AI tool usage?',
		helpText:
			'63% of organizations that experienced a shadow AI breach lacked an AI governance policy (IBM 2025). Without documented policy, there is no standard of care to reference and no defense when incidents occur.',
		options: [
			{ score: 0, label: 'No — we have no formal AI usage policy' },
			{
				score: 1,
				label: 'In development — a policy is being drafted but does not yet exist in final form'
			},
			{
				score: 2,
				label:
					'Yes, but limited — a policy exists but is not widely communicated or consistently enforced'
			},
			{
				score: 3,
				label:
					'Yes, comprehensive — a clear policy employees know, understand, and are held accountable to'
			}
		]
	},

	{
		id: 'q05',
		riskCategory: 'visibility',
		text: 'How do employees currently get new AI tools approved for work use?',
		helpText:
			'Shadow AI often enters organizations because legitimate approval channels are too slow or unclear. When the gate is difficult to navigate, employees go around it — creating ungoverned usage that grows invisibly.',
		options: [
			{
				score: 0,
				label: 'No process — employees adopt AI tools on their own without any approval requirement'
			},
			{
				score: 1,
				label: 'Informal — approval depends on who you ask; no consistent process or criteria exist'
			},
			{
				score: 2,
				label:
					'Process exists but is slow or unclear, so employees frequently bypass it to get work done'
			},
			{
				score: 3,
				label:
					'Clear, fast process — employees know how to request approval and consistently use it'
			}
		]
	},

	// ─── DETECTION ─────────────────────────────────────────────────────────────

	{
		id: 'q06',
		riskCategory: 'detection',
		text: 'Has your organization experienced any AI-related security incidents, data leaks, or compliance concerns in the past 12 months?',
		helpText:
			'1 in 5 organizations has experienced a data breach caused by shadow AI (IBM 2025). When a breach involves shadow AI, the average additional cost is $670,000 beyond a standard breach.',
		options: [
			{
				score: 0,
				label:
					'Yes — confirmed AI-related security incidents or data leaks have occurred in the past year'
			},
			{
				score: 1,
				label:
					'Possibly — concerns have been raised but we lack the visibility to confirm or rule out incidents'
			},
			{
				score: 2,
				label: 'Not that we know of — but we lack monitoring capability, so we cannot be confident'
			},
			{
				score: 3,
				label:
					'No incidents — and we have monitoring in place that would have detected them if they occurred'
			}
		]
	},

	{
		id: 'q07',
		riskCategory: 'detection',
		text: 'Can your IT or security team detect when employees use unapproved AI tools?',
		helpText:
			'97% of organizations that experienced an AI breach lacked proper AI access controls (IBM 2025). You cannot govern what you cannot see — detection capability is the foundation of shadow AI management.',
		options: [
			{
				score: 0,
				label:
					'No — we have no mechanism to detect unapproved AI tool usage across our organization'
			},
			{
				score: 1,
				label:
					'Limited — we can detect some usage through network logs, but visibility is narrow and reactive'
			},
			{
				score: 2,
				label:
					'Partial — we have some monitoring tools in place but coverage is incomplete or inconsistent'
			},
			{
				score: 3,
				label:
					'Comprehensive — we have active monitoring that detects unapproved AI tool usage organization-wide'
			}
		]
	},

	// ─── TRAINING ──────────────────────────────────────────────────────────────

	{
		id: 'q08',
		riskCategory: 'training',
		text: 'Have employees received clear guidance on what data is and is not appropriate to share with AI tools?',
		helpText:
			'Untrained employees are the primary vector for shadow AI data exposure. Even well-intentioned employees will make poor decisions about what to share with AI tools if they have not been explicitly trained on the boundaries.',
		options: [
			{
				score: 0,
				label: 'No — employees have received no guidance on AI data handling'
			},
			{
				score: 1,
				label:
					'Minimal — AI was briefly mentioned in a general security training, with no specific guidance'
			},
			{
				score: 2,
				label:
					'Some — guidance has been issued but it is not comprehensive, current, or verified as received'
			},
			{
				score: 3,
				label:
					'Comprehensive — employees have received specific, current AI data handling training and confirmed understanding'
			}
		]
	}
];

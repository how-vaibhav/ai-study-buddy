import { createClient } from '@/utils/supabase/server';

export const POST = async (request: Request) => {
	try {
		const supabase = await createClient();
		const body = await request.json();
		const { generalInfo, dailyRoutines, title } = body;

		function parseGeneralInfo(content: string) {
			// 1. Identify the split points using regex for the main headers
			const topicSectionMatch = '## 2. TOPIC-WISE STUDY APPROACH';
			const resourceSectionMatch = '## 4. RESOURCES AND MOCK TESTS';

			// 2. Extract the Overview (Everything before Topic section)
			const overviewPart = content.split(topicSectionMatch)[0].trim();

			// 3. Extract the Topics (Everything between Topics and Resources)
			const topicPartRaw = content.split(topicSectionMatch)[1];
			const topicPart = topicPartRaw.split(resourceSectionMatch)[0].trim();

			// 4. Extract Resources (Everything after the Resource header)
			const resourcePart = content.split(resourceSectionMatch)[1].trim();

			return {
				overview: overviewPart,
				topics: topicPart,
				resources: resourcePart,
			};
		}

		const { overview, topics, resources } = parseGeneralInfo(generalInfo);

		console.log(dailyRoutines);

		const structuredRoutine = dailyRoutines.map((item: any, index: number) => {
			// Access the 'content' property of the object
			const rawContent = item.content || '';

			// Now split the string
			const header = rawContent.split('\n')[0].trim();

			return {
				day_number: item.dayNumber || index + 1, // Use the existing dayNumber
				title: item.title || header, // Use existing title or extracted header
				content: rawContent,
				is_completed: false,
				completed_at: null,
			};
		});

		const { data: PlanData, error: PlanError } = await supabase
			.from('studyPlans')
			.insert({
				overview: overview,
				topics: topics,
				resources: resources,
				daily_routines: structuredRoutine,
				title: title,
			});

		if (PlanError)
			return Response.json(
				{ error: PlanError.message, success: false },
				{ status: 500 },
			);

		return Response.json({ success: true });
	} catch (error) {
		return Response.json(
			{ error: 'Failed to save plan.', success: false },
			{ status: 500 },
		);
	}
};

export const GET = async () => {
	try {
		const supabase = await createClient();

		const { data: StudyPlans, error: PlanError } = await supabase
			.from('studyPlans')
			.select('plan_id, title, created_at, overview');

		if (PlanError)
			return Response.json(
				{ success: false, error: PlanError.message },
				{ status: 500 },
			);

		return Response.json({ success: true, StudyPlans });
	} catch (error) {
		return Response.json(
			{ success: false, error: error || 'Internal Server Error' },
			{ status: 500 },
		);
	}
};

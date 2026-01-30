import { createClient } from '@/utils/supabase/server';

export const GET = async (
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) => {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		const supabase = await createClient();

		const { data: planData, error: planError } = await supabase
			.from('studyPlans')
			.select('plan_id, daily_routines, overview, resources, topics, title')
			.eq('plan_id', id)
			.single();

		if (planError)
			return Response.json(
				{ success: false, error: planError.message },
				{ status: 500 },
			);
		return Response.json({ success: true, planData });
	} catch (error) {
		return Response.json(
			{ success: false, message: error || 'Internal Server Error!' },
			{ status: 500 },
		);
	}
};

export async function PATCH(req: Request) {
	try {
		const supabase = await createClient();
		const { id, dayIndex, isCompleted } = await req.json();

		console.log(id, dayIndex, isCompleted);

		// 1. Fetch current plan to get the array
		const { data: plan, error: fetchError } = await supabase
			.from('studyPlans')
			.select('daily_routines')
			.eq('plan_id', id)
			.single();

		console.log(plan, fetchError);

		if (fetchError || !plan) throw new Error('Plan not found');

		// 2. Modify the specific index
		const updatedRoutines = [...plan.daily_routines];
		updatedRoutines[dayIndex].is_completed = isCompleted;
		updatedRoutines[dayIndex].completed_at = isCompleted
			? new Date().toISOString()
			: null;

		console.log(updatedRoutines);

		// 3. Save back to Supabase
		const { error: updateError } = await supabase
			.from('studyPlans')
			.update({ daily_routines: updatedRoutines })
			.eq('plan_id', id);

		console.log(updateError);

		if (updateError) throw updateError;

		return Response.json({ success: true, updatedRoutines });
	} catch (error: any) {
		return Response.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}
}

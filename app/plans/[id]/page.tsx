'use client';

import { DashboardNav } from '@/components/dashboard-nav';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, use } from 'react';
import { MouseParallax } from 'react-just-parallax';
import {
	Card,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface DailyRoutines {
	title: string;
	content: string;
	is_completed: boolean;
	completed_at: string | null;
}

interface PlanInterface {
	plan_id: string;
	daily_routines: DailyRoutines[];
	overview: string;
	resources: string;
	title: string;
	topics: string;
}

export default function StudyPlan({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { toast } = useToast();

	const [plans, setPlans] = useState<PlanInterface | null>(null);

	const completeDay = async (e: React.MouseEvent, index: number) => {
		if (!plans) return;
		e.preventDefault();

		const previousRoutines = [...plans.daily_routines];
		const isMarkingComplete = !previousRoutines[index].is_completed;

		// --- 20-HOUR LOCK LOGIC ---
		if (isMarkingComplete) {
			// 1. SEQUENCE CHECK: Ensure day before is done
			if (index > 0) {
				const previousDayComplete = previousRoutines[index - 1].is_completed;
				if (!previousDayComplete) {
					toast({
						title: 'One step at a time!',
						description: `Please complete Day ${index} before starting Day ${index + 1}.`,
						variant: 'destructive',
					});
					return;
				}
			}

			// 2. 20-HOUR LOCK LOGIC
			const timestamps = previousRoutines
				.filter((d, i) => d.completed_at && i !== index)
				.map((d) => new Date(d.completed_at!).getTime());

			if (timestamps.length > 0) {
				const lastCompletionTime = Math.max(...timestamps);
				const currentTime = new Date().getTime();
				const hoursSinceLastCompletion =
					(currentTime - lastCompletionTime) / (1000 * 60 * 60);

				if (hoursSinceLastCompletion < 20) {
					const hoursLeft = (20 - hoursSinceLastCompletion).toFixed(1);
					toast({
						title: 'Slow down!',
						description: `Please wait ${hoursLeft} more hours before marking another day complete.`,
						variant: 'destructive',
					});
					return;
				}
			}
		}

		// 1. Optimistic Update
		const newStatus = isMarkingComplete;
		const optimisticRoutines = [...previousRoutines];
		optimisticRoutines[index].is_completed = newStatus;
		optimisticRoutines[index].completed_at = newStatus
			? new Date().toISOString()
			: null;

		setPlans({ ...plans, daily_routines: optimisticRoutines });

		// 2. API Call
		try {
			const response = await fetch('/api/study-plan', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: id,
					dayIndex: index,
					isCompleted: newStatus,
				}),
			});

			const data = await response.json();
			if (!data.success) throw new Error(data.error);
		} catch (error) {
			// 3. Rollback
			setPlans({ ...plans, daily_routines: previousRoutines });
			toast({
				title: 'Sync Failed',
				description: "Couldn't save progress.",
				variant: 'destructive',
			});
		}
	};
	useEffect(() => {
		const getPlans = async () => {
			try {
				const response = await fetch(`/api/study-plan?id=${id}`);

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(errorText || 'Internal server Error');
				}

				const data = await response.json();

				if (!data.success) {
					console.log('Error');
					toast({
						title: 'error',
						description: data.error || 'Internal Server Error',
						variant: 'destructive',
					});
				}

				setPlans(data.planData);
			} catch (error) {
				toast({
					title: 'error',
					description: 'An Error Occurred!',
					variant: 'destructive',
				});
			}
		};
		getPlans();
	}, []);

	return (
		<div>
			<DashboardNav />

			<MouseParallax strength={0.03} enableOnTouchDevice={false}>
				<div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-emerald-300/20 blur-3xl" />
				<div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-purple-300/20 blur-3xl" />
			</MouseParallax>

			<div className="grid grid-cols-2 gap-7 m-10">
				<Card className="">
					<CardTitle className="text-center text-purple-800 font-bold text-2xl">
						Overview
					</CardTitle>
					<CardContent>
						<ReactMarkdown>{plans?.overview}</ReactMarkdown>
					</CardContent>
				</Card>
				<Card className="">
					<CardTitle className="text-center text-purple-800 font-bold text-2xl">
						Resources
					</CardTitle>
					<CardContent>
						<ReactMarkdown>{plans?.resources}</ReactMarkdown>
					</CardContent>
				</Card>
			</div>

			<Card className="m-10">
				<CardTitle className="text-center text-purple-800 font-bold text-2xl">
					Topics
				</CardTitle>
				<CardContent>
					<ReactMarkdown>{plans?.topics}</ReactMarkdown>
				</CardContent>
			</Card>

			<div className="grid grid-cols-5 gap-4 m-5">
				{plans &&
					plans.daily_routines.map((day, i) => (
						<Card>
							<CardTitle className="text-center text-purple-800 font-bold">
								Day {i + 1} ({day.is_completed ? 'Completed' : 'Not Completed'})
							</CardTitle>
							<CardContent>
								<ReactMarkdown>{day.content}</ReactMarkdown>
								<div className="justify item-center justify-center">
									<button
										className="mx-13 mt-5 px-5 py-3 rounded-2xl bg-green-600 text-xl text-white font-bold"
										onClick={(e) => completeDay(e, i)}
									>
										Complete
									</button>
								</div>
							</CardContent>
						</Card>
					))}
			</div>
		</div>
	);
}

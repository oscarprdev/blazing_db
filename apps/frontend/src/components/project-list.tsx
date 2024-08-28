'use server';

import { auth } from '../auth';
import { listProjects } from '@/src/lib/db/queries';
import { cn, isError } from '@/src/lib/utils';
import { IconDots } from '@tabler/icons-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

async function ProjectList({ projectId }: { projectId?: string }) {
	const session = await auth();
	const response = await listProjects({ token: session?.user?.id || '' });

	if (
		!projectId &&
		!isError(response) &&
		response.success.projects.length > 0 &&
		response.success.projects[0] &&
		'projectId' in response.success.projects[0]
	) {
		redirect(`/dashboard?projectId=${response.success.projects[0]?.projectId}`);
	}

	return (
		<>
			{!isError(response) ? (
				<ul aria-label="scroll" className="overflow-y-scroll max-h-[150px] w-full">
					{response.success.projects.map(project => (
						<ProjectItem
							key={project.projectId}
							projectId={project.projectId}
							title={project.title}
							currentProjectId={projectId}
						/>
					))}
				</ul>
			) : (
				<ProjectListWrapper>
					<p className="text-xs text-destructive">{response.error}</p>
				</ProjectListWrapper>
			)}
		</>
	);
}

function ProjectItem({
	projectId,
	title,
	currentProjectId,
}: {
	projectId: string;
	title: string;
	currentProjectId?: string;
}) {
	return (
		<li
			key={projectId}
			className={cn(
				currentProjectId === projectId
					? 'bg-dark3 hover:bg-dark4 text-light'
					: 'bg-dark2 hover:bg-dark3 hover:text-light',
				'relative px-5 my-1 duration-200 p-2 rounded-lg border border-dark3  w-full flex justify-between items-center font-semibold'
			)}>
			{currentProjectId === projectId && (
				<span className="absolute size-2 rounded-full top-0 left-0 bg-secondary"></span>
			)}
			<Link href={`/dashboard?projectId=${projectId}`} className="hover:underline duration-150">
				{title}
			</Link>
			<IconDots size={16} />
		</li>
	);
}

function ProjectListWrapper({ children }: { children: ReactNode }) {
	return <div className="bg-dark1 w-full h-[40px] rounded-xl flex items-center justify-center px-3">{children}</div>;
}

function ProjectListFallback() {
	return (
		<ProjectListWrapper>
			<IconDots className="text-light4 animate-pulse" size={14} />
		</ProjectListWrapper>
	);
}

export { ProjectList, ProjectListFallback };

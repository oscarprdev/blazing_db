import { DescribeProjectInfraOutput } from './describe-project.infra-types';
import { Database } from '@/db';

export interface IDescribeProjectInfra {
	describeProject(projectId: string): Promise<DescribeProjectInfraOutput>;
}

export class DescribeProjectInfra implements IDescribeProjectInfra {
	constructor(private readonly db: Database) {}

	async describeProject(projectId: string) {
		try {
			const res = await this.db.query('SELECT * FROM projects WHERE projectid = $1', [projectId]);

			return res[0] as DescribeProjectInfraOutput;
		} catch (error) {
			throw new Error('Error describing project by its id');
		}
	}
}

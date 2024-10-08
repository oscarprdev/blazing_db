import { DescribeProjectPorts, DescribeProjectPortsTypes } from '../describe-project.ports';
import { DescribeProjecPostgreInfra } from './describe-project.postgre-infra';
import { ProjectType } from '@/types';

export class DescribeProjectPostgreAdapter implements DescribeProjectPorts {
	constructor(private readonly infra: DescribeProjecPostgreInfra) {}

	async describeProject(projectId: string): Promise<DescribeProjectPortsTypes.DescribeDatabaseUrlOutput> {
		const res = await this.infra.describeProject(projectId);

		return {
			type: res.type as ProjectType,
			title: res.title,
			databaseUrl: res.url,
		};
	}

	async extractTables(databaseUrl: string) {
		const output = await this.infra.extractTables(databaseUrl);

		return output.tablesDB.filter(tab => tab.table_name[0] !== '_').map(tab => tab.table_name);
	}

	async extractFields(databaseUrl: string, tableName: string) {
		const output = await this.infra.extractFields(databaseUrl, tableName);

		return {
			fields: output.fieldsDB.map(field => ({
				name: field.column_name,
				type: field.data_type,
				fieldConstraint: field.constraint_type,
			})),
		};
	}

	async extractReference(databaseUrl: string) {
		const res = await this.infra.extractReference(databaseUrl);

		return res && res.length > 0
			? res.map(a => ({
					referenced: a.referenced_table,
					table: a.foreign_table,
					originalField: a.foreign_column,
				}))
			: [];
	}
}

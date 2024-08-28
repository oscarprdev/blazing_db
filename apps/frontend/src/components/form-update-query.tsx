import { useFormUpdateQuery } from '../lib/hooks/use-form-update-query';
import { Query } from '../lib/types';
import AiViewer from './ai-viewer';
import { Button } from './ui/button';
import { IconLoader2 } from '@tabler/icons-react';
import React from 'react';
import { useFormStatus } from 'react-dom';

function FormUpdateQuery({ query, handleCloseModal }: { query: Query; handleCloseModal: () => void }) {
	const { queryResponse, handleSubmit } = useFormUpdateQuery({ query });
	return (
		<article className="w-full flex flex-col gap-3 overflow-hidden">
			<label className=" text-xs text-light2">Query:</label>
			<AiViewer aiResponse={{ value: query.value, language: query.language }} />
			<label className=" text-xs text-light2">Output:</label>
			<AiViewer aiResponse={{ value: queryResponse }} />
			<form action={handleSubmit} className="ml-auto mt-auto flex gap-5 items-center">
				<Button onClick={handleCloseModal} type="button" variant={'secondary'}>
					Close
				</Button>
				<FormUpdateQuerySubmitButton />
			</form>
		</article>
	);
}

function FormUpdateQuerySubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" className="font-semibold" disabled={pending}>
			{pending ? <IconLoader2 className="animate-spin" size={20} /> : 'Apply'}
		</Button>
	);
}

export default FormUpdateQuery;

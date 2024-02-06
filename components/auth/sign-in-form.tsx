'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	message: string | null;
	error: string | null;
}

enum Role {
	USER = 'USER',
	CANTEEN = 'CANTEEN',
	ADMIN = 'ADMIN',
}

const FormSchema = z.object({
	email: z.string().email({
		message: 'Please enter a valid email.',
	}),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters.',
	}),
	role: z.enum(['USER', 'CANTEEN', 'ADMIN']),
});

export function SignInForm({
	message,
	error,
	className,
	...props
}: UserAuthFormProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	useEffect(() => {
		if (message) {
			setTimeout(() => {
				toast({
					title: 'Account Created Successfully',
					description: message,
					className: 'bg-lime-500 text-primary',
				});
			}, 100);
		}
	}, [message]);
	useEffect(() => {
		if (error) {
			setTimeout(() => {
				toast({
					variant: 'destructive',
					title: 'LogIn Unsuccessful',
					description: error,
				});
			}, 100);
		}
	}, [error]);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: '',
			password: '',
			role: 'USER',
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			setIsLoading(true);
			// toast({
			// 	title: 'You submitted the following values:',
			// 	description: (
			// 		<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
			// 			<code className='text-white'>
			// 				{JSON.stringify(data, null, 2)}
			// 			</code>
			// 		</pre>
			// 	),
			// });
			await signIn('credentials', {
				redirect: true,
				email: data.email,
				password: data.password,
				role: data.role,
			});
		} catch (error: any) {
			console.log(error);
			toast({
				variant: 'destructive',
				title: 'LogIn failed',
				description: error.message ?? 'Something went wrong',
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className={cn('grid gap-6', className)} {...props}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-5'
				>
					<div className='space-y-3'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem className='space-y-1'>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type='email'
											placeholder='james@gmail.com'
											{...field}
										/>
									</FormControl>
									<FormMessage className='' />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem className='space-y-1'>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type='password'
											placeholder=''
											{...field}
										/>
									</FormControl>
									<FormMessage className='' />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='role'
							render={({ field }) => (
								<FormItem className='flex items-center gap-3'>
									<FormLabel className='w-1/5'>
										Role
									</FormLabel>
									<FormControl>
										<Select
											{...field}
											onValueChange={(value: Role) =>
												form.setValue('role', value)
											}
										>
											<SelectTrigger className='grow'>
												<SelectValue placeholder='Select a role' />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>
														Roles
													</SelectLabel>
													<SelectItem
														value={Role.USER}
													>
														{Role.USER}
													</SelectItem>
													<SelectItem
														value={Role.CANTEEN}
													>
														{Role.CANTEEN}
													</SelectItem>
													<SelectItem
														value={Role.ADMIN}
													>
														{Role.ADMIN}
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage className='' />
								</FormItem>
							)}
						/>
					</div>
					<Button type='submit' className='w-full'>
						{isLoading && (
							<Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
						)}
						Sign In
					</Button>
				</form>
			</Form>
		</div>
	);
}

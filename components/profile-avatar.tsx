'use client';

import * as React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export function ProfileAvatar() {
	const { data: session } = useSession({
		required: true,
		onUnauthenticated() {
			redirect('/signin');
		},
	});
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className='cursor-pointer'>
					<AvatarImage
						src='https://github.com/shadcn.png'
						alt='@shadcn'
					/>
					<AvatarFallback>{session?.user.name.toUpperCase().split(" ").slice(0, 3).map((s:string)=>s.charAt(0)).join("")}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-25 my-2 mx-3'>
				<DropdownMenuLabel>
					{session?.user.name.split(" ").at(0)}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Billing</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className='text-danger'
					onClick={() =>
						signOut({
							callbackUrl: '/signin',
							redirect: true,
						})
					}
				>
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

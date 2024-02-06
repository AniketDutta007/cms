'use client';

import * as React from 'react';
import { signOut } from 'next-auth/react';
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

type Checked = DropdownMenuCheckboxItemProps['checked'];

export function ProfileAvatar() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className='cursor-pointer'>
					<AvatarImage
						src='https://github.com/shadcn.png'
						alt='@shadcn'
					/>
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-25 my-2 mx-3'>
				<DropdownMenuLabel>Profile</DropdownMenuLabel>
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

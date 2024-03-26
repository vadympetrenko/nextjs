import { useState } from 'react';

export type useModalType = [isShowing: boolean, toggle: () => void ]


export const useModal = ():useModalType => {
	const [isShowing, setIsShowing] = useState<boolean>(false);

	const toggle = () => {
		setIsShowing(!isShowing);
	}

	return [
		isShowing,
		toggle
	];
}


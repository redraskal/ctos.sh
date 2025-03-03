'use client';

import { RefObject, useEffect, useState } from "react";

export function useIsObserved(ref: RefObject<HTMLElement|null>) {
	const [isObserved, setIsObserved] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			const [entry] = entries;
			setIsObserved(entry.isIntersecting);
		});

		observer.observe(ref.current!);

		return () => {
			observer.disconnect();
		};
	}, [ref]);

	return isObserved;
}

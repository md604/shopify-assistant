import { useState, useEffect, useMemo, useRef } from 'react';

type ObserverProps = {
    root: Element | null,
    rootMargin: string,
    threshold: Array<number>
};

type InViewResults = [ React.RefObject<Element>|undefined, boolean];

export function useElementInView(observerOptions: ObserverProps): InViewResults {
    const elementRef = useRef<Element>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const handleBeacon = (entries: IntersectionObserverEntry[]) => {
        const [ beaconEl ] = entries;
        setIsVisible(beaconEl.isIntersecting);
    }

    useEffect(
        () => {
            const observer = new IntersectionObserver(handleBeacon, observerOptions);
            if (elementRef.current) observer.observe(elementRef.current);
            return () => {
                if (elementRef.current) observer.unobserve(elementRef.current);
            }
        },
        [elementRef, observerOptions]
    );
    return [elementRef, isVisible];
}
import { useLayoutEffect, useRef, useState } from 'react';
import { Chip } from '../Chip/Chip';
import s from './chipsList.module.scss';
import { MOCK_CHIPS } from '../../mocks/mockChips';

export function ChipsList() {
    const [visibleChips, setVisibleChips] = useState(MOCK_CHIPS.length);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedChips, setSelectedChips] = useState<number[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const measuringContainerRef = useRef<HTMLDivElement>(null);
    const moreButtonRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        const calculateVisibleChips = () => {
            if (!containerRef.current || !measuringContainerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            const moreButtonWidth = moreButtonRef.current?.offsetWidth || 60;
            const gap = 8;

            const allChipsNodes = measuringContainerRef.current.children;

            let totalWidth = 0;
            let count = 0;

            for (let i = 0; i < allChipsNodes.length; i++) {
                const chipWidth = (allChipsNodes[i] as HTMLElement).offsetWidth;

                const widthWithGap = chipWidth + (i === 0 ? 0 : gap);

                if (i < MOCK_CHIPS.length - 1) {
                    if (
                        totalWidth + widthWithGap + gap + moreButtonWidth >
                        containerWidth
                    )
                        break;
                } else {
                    if (totalWidth + widthWithGap > containerWidth) break;
                }

                totalWidth += widthWithGap;
                count++;
            }

            setVisibleChips(Math.max(1, count));
        };

        calculateVisibleChips();

        const resizeObserver = new ResizeObserver(calculateVisibleChips);
        if (containerRef.current) resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    const handleChipClick = (id: number) => {
        setSelectedChips((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const handleMoreButtonClick = () => {
        setShowPopup((prev) => !prev);
    };

    const hasHidden = visibleChips < MOCK_CHIPS.length;

    return (
        <div className={s.wrapper}>
            <div
                ref={measuringContainerRef}
                className={s.container}
                style={{
                    position: 'absolute',
                    visibility: 'hidden',
                    pointerEvents: 'none',
                    zIndex: -1,
                    whiteSpace: 'nowrap',
                }}
            >
                {MOCK_CHIPS.map((chip) => (
                    <Chip key={`measure-${chip.id}`} label={chip.label} />
                ))}
            </div>

            <div ref={containerRef} className={s.container}>
                {MOCK_CHIPS.slice(0, visibleChips).map((chip) => (
                    <Chip
                        key={chip.id}
                        label={chip.label}
                        selected={selectedChips.includes(chip.id)}
                        onClick={() => handleChipClick(chip.id)}
                    />
                ))}

                {hasHidden && (
                    <Chip
                        ref={moreButtonRef}
                        label={'...'}
                        onClick={handleMoreButtonClick}
                    />
                )}
            </div>

            {showPopup && hasHidden && (
                <div className={s.popup}>
                    <div className={s.popupContent}>
                        {MOCK_CHIPS.slice(visibleChips).map((chip) => (
                            <Chip
                                key={chip.id}
                                label={chip.label}
                                selected={selectedChips.includes(chip.id)}
                                onClick={() => {
                                    handleChipClick(chip.id);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

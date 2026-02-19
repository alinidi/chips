import { useLayoutEffect, useRef, useState } from 'react';
import { Chip } from '../Chip/Chip';
import s from './chipsList.module.scss';

const MOCK_CHIPS = [
    { label: 'Чипс 1', id: 1 },
    { label: 'Чипс 2', id: 2 },
    { label: 'Чипс 3', id: 3 },
    { label: 'Чипс 4', id: 4 },
    { label: 'Чипс 5', id: 5 },
    { label: 'Чипс 6', id: 6 },
    { label: 'Чипс 7', id: 7 },
    { label: 'Чипс 8', id: 8 },
    { label: 'Чипс 9', id: 9 },
    { label: 'Чипс 10', id: 10 },
    { label: 'Чипс 11', id: 11 },
    { label: 'Чипс 12', id: 12 },
    { label: 'Чипс 13', id: 13 },
];

export function ChipsList() {
    const [visibleChips, setVisibleChips] = useState(MOCK_CHIPS.length);
    const [showPopup, setShowPopup] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const chipsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const moreButtonRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        const calculateVisibleChips = () => {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            let totalWidth = 0;
            let count = 0;

            const moreButtonWidth = moreButtonRef.current?.offsetWidth || 60;

            for (let i = 0; i < MOCK_CHIPS.length; i++) {
                const chip = chipsRef.current[i];
                if (chip) {
                    totalWidth += chip.offsetWidth + 8;

                    if (i < MOCK_CHIPS.length - 1) {
                        if (totalWidth + moreButtonWidth > containerWidth) {
                            break;
                        }
                    } else {
                        if (totalWidth > containerWidth) break;
                    }

                    count++;
                }
            }

            setVisibleChips(Math.max(1, count));
        };

        calculateVisibleChips();

        window.addEventListener('resize', calculateVisibleChips);
        return () =>
            window.removeEventListener('resize', calculateVisibleChips);
    }, []);

    const handleMoreButtonClick = () => {
        setShowPopup((prev) => !prev);
    };

    const hasHidden = visibleChips < MOCK_CHIPS.length;

    return (
        <div className={s.wrapper}>
            <div ref={containerRef} className={s.container}>
                {MOCK_CHIPS.slice(0, visibleChips).map((chip, index) => (
                    <Chip
                        key={chip.id}
                        ref={(el) => {
                            chipsRef.current[index] = el;
                        }}
                        label={chip.label}
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
                        <div className={s.popupChips}>
                            {MOCK_CHIPS.slice(visibleChips).map((chip) => (
                                <Chip
                                    key={chip.id}
                                    label={chip.label}
                                    onClick={() => {
                                        setShowPopup(false);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

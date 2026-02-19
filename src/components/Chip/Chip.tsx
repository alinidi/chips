import { forwardRef } from 'react';
import s from './chip.module.scss';

type ChipProps = {
    label: string;
    selected?: boolean;
    onClick?: () => void;
};

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
    ({ label, selected, onClick }, ref) => {
        return (
            <button
                ref={ref}
                className={`${s.chip} ${selected ? s.selected : ''}`}
                onClick={onClick}
            >
                {label}
            </button>
        );
    }
);

import s from './chip.module.scss';

type ChipProps = {
    label: string;
    selected?: boolean;
    onClick?: () => void;
};

export function Chip({ label, selected, onClick }: ChipProps) {
    return (
        <button
            className={`${s.chip} ${selected ? s.selected : ''}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

import "./toggle.scss";

interface Props {
    label?: string;
    onClick?: () => void
}

export default function Toggle({ label, onClick }: Props) {
    return (
        <span className="switch-container">
            <div className="switch-label">
                {label}
            </div>
            <label className="switch">
                <input type="checkbox" onClick={onClick} />
                <span className="slider round"></span>
            </label>
        </span>
    )
}
export default function Conch({ handleHint }) {
    return (
        <div>
            <a onClick={handleHint} style={{ cursor: 'pointer' }}>
                <img src="/hint.png" alt="Hint Image" style={{ width: '100px', height: 'auto' }} />
            </a>
        </div>
    );
}

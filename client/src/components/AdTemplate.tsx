export default function AdTemplate({ ad }: any) {
    return (
        <div className="ad-template">
            <img src={ad?.image} alt="ad" />
            <div className="info">
                <p>{ad?.name}</p>
                <p>Location: <span>{ad?.locality}</span></p>
                <p>Price: <span>{ad?.price}</span></p>
            </div>

        </div>
    )
}
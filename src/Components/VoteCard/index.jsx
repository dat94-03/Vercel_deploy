import { useState } from 'react';
import styles from './VoteCard.module.scss';
import { Link } from "react-router-dom";
import { vote_candidate, vote_card } from '../../Assets/index.js';
import { useActiveAccount } from "thirdweb/react";

function VoteCard({ election, backendElections }) {
    const activeAccount = useActiveAccount();
    const [imageLoaded, setImageLoaded] = useState(false); // State to track image loading

    const isElectionEnded = (electionDue) => {
        return electionDue * 1000 < Date.now(); // Compare with current time in ms
    };

    const handleImageLoad = () => {
        setImageLoaded(true); // Set image as loaded once onLoad is triggered
    };

    const imageSrc = backendElections.find(e => Number(e.id) === Number(election.id))?.photoLink;

    return (
        <div
            className={`${styles['vote-card']} 
            ${isElectionEnded(election.electionDue) ? styles['disabled'] : ''} 
            ${activeAccount?.address.toLowerCase() === election?.owner.toLowerCase() ? styles['owner'] : ''}`}
        >
            <Link
                to={`/vote/${election.electionAddr}`}
                state={{ voteAddr: election.electionAddr }}
                className={styles['vote-card__link']}
            ></Link>
            <div className={`${styles['image-wrapper']} ${!imageLoaded ? styles['skeleton'] : ''}`}>
                <img
                    src={imageSrc}
                    alt="Election"
                    className={styles['vote-card__image']}
                    onLoad={handleImageLoad} // Trigger when the image loads
                />
            </div>
            <div className={styles['vote-card__text-wrapper']}>
                <h2 className={styles['vote-card__title']}>{election.title}</h2>
                <div className={styles['vote-card__stat']}>
                    <div className={styles['vote-card__stat__ele']}>
                        <img src={vote_card} alt="Votes" />
                        <span>{election.totalVotes}</span>
                    </div>
                    <div className={styles['vote-card__stat__ele']}>
                        <img src={vote_candidate} alt="Candidates" />
                        <span>{election.numOfCandidates}</span>
                    </div>
                </div>
                <p className={styles['vote-card__due']}>
                    {election.electionDue
                        ? `Vote end: ${new Date(election.electionDue * 1000).toISOString().replace('T', ' ').split('.')[0]}`
                        : 'No end date available'}
                </p>
            </div>
        </div>
    );
}

export default VoteCard;

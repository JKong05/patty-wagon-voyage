import React, { useState } from 'react';
import { Howl } from 'howler';
import sound from '../assets/transition-sound.mp3';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Transition from '../components/Transition';
import axios from 'axios';
import BlitzButtonMenu from '../components/buttons/BlitzButtons';

export default function SelectBlitz() {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const navigate = useNavigate();
    const { setHomeButtons } = useOutletContext();

    const handleBack = () => {
        setHomeButtons(true);  // Reset home buttons state in parent
        navigate('/');
    }

    const transitionSound = new Howl({
        src: [sound]
    });

    const handleStartBlitz = async () => {
        try {
            await axios.post('http://localhost:5000/setgame',
                { numQuestion: 50, difficulty: "" },
                { withCredentials: true }
            );

            setIsRedirecting(true)
            setTimeout(() => { transitionSound.play() }, 250);
            setTimeout(() => { navigate('/blitz') }, 5000);
        } catch (e) {
            console.error('Internal error', e);
        }
    };

    return (
        <div>
            <BlitzButtonMenu
                handleBack={handleBack}
                handleStartBlitz={handleStartBlitz}
            />
            {isRedirecting && (
                <Transition />
            )}
        </div>
    );
}
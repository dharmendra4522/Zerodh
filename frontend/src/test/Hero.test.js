import react from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Hero from '../landing_page/home/Hero';

//Test suite for the Hero component
describe('Hero Component', () => {
    test('renders the Hero component', () => {
        render(<Hero />);
        // Check if the component renders correctly
        const heroImage = screen.getByAltText('Hero Image');
        expect(heroImage).toBeInTheDocument();
        expect(heroImage).toHaveAttribute("src", 'media/images/homeHero.png');    
    });

    test('renders signup buttion', () => {
        render(<Hero />);
        // Check if the component renders correctly
        const signupButton = screen.getByRole('button', {name: "/signup"});
        expect(signupButton).toBeInTheDocument();
        expect(signupButton).toHaveClass("btn-primary");    
    });
});
    
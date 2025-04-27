import Image from 'next/image';
import TerminalSvg from './terminal.svg';

interface LogoProps {
    height?: number;
    width?: number;
}

const Logo = ({ height = 48, width = 48 }: LogoProps) => {
    return (
        <Image
            width={width}
            height={height}
            alt='terminal logo'
            src={TerminalSvg} />
    )
}

export default Logo
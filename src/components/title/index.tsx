import { Logo } from "./styled";
import { BikeWhiteIcon } from "components";

type TitleProps = {
    collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    return (
        <Logo>
            {collapsed ? (
                <img style={{ width: 25 }} src="/images/bike.png" alt="CBVENDON" />
            ) : (
                <img style={{ width: 50 }} src="/images/logo.png" alt="CBVENDON" />
            )}
        </Logo>
    );
};

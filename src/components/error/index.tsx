import { Spin } from "@pankod/refine-antd"

type TitleProps = {

};

export const Error: React.FC<TitleProps> = () => {
    return (
        <div style={{ width: '100%', height: '85vh', lineHeight: '80vh', textAlign: 'center' }}><Spin size={"large"} tip={"Loading..."}></Spin></div>
    );
};
import { AuthPage as AntdAuthPage, AuthProps } from "@pankod/refine-antd";
import { useRouterContext } from "@pankod/refine-core";

const authWrapperProps = {
    style: { background: `rgb(255 255 255)` }
};

const renderAuthContent = (content: React.ReactNode) => {
    const { Link } = useRouterContext();
    return (
        <div
            style={{
                maxWidth: 500,
                textAlign: 'center',
                margin: "0 auto",
            }}
        >
            <Link to="/">
                <img
                    style={{ margin: '20px auto' }}
                    src="/images/logo.png"
                    alt="Logo"
                    width="30%"
                />
            </Link>
            {content}
        </div>
    );
};

export const AuthPage: React.FC<AuthProps> = (props) => {
    return (
        <AntdAuthPage
            wrapperProps={authWrapperProps}
            renderContent={renderAuthContent}
            {...props}
        />
    );
};

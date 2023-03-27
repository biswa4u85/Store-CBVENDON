import {
    Create,
    DrawerProps,
    FormProps,
    ButtonProps,
    Grid,
} from "@pankod/refine-antd";

import { FormList } from "./form";
import { Drawer } from "./styled";

type CreateProductProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
};

export const CreateProduct: React.FC<CreateProductProps> = ({
    drawerProps,
    formProps,
    saveButtonProps,
}) => {
    const breakpoint = Grid.useBreakpoint();
    return (
        <Drawer
            {...drawerProps}
            width={breakpoint.sm ? "500px" : "100%"}
            bodyStyle={{ padding: 0 }}
            zIndex={1001}
        >
            <Create resource="products" saveButtonProps={saveButtonProps}>
                <FormList formProps={formProps} />
            </Create>
        </Drawer>
    );
};

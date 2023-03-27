import {
    Edit,
    Drawer,
    DrawerProps,
    FormProps,
    ButtonProps,
    Grid,
} from "@pankod/refine-antd";

import { FormList } from "./form";

type EditProductProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
};

export const EditProduct: React.FC<EditProductProps> = ({
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
            <Edit
                saveButtonProps={saveButtonProps}
                headerProps={{ extra: null }}
                resource="products"
            >
                <FormList formProps={formProps} />
            </Edit>
        </Drawer>
    );
};

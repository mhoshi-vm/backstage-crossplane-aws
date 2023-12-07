import {useEntity} from "@backstage/plugin-catalog-react";
import React from "react";
import {Route, Routes} from "react-router-dom";
import {CrossplaneAwsComponent} from "./components/CrossplaneAws";

export const Router = (props: { refreshIntervalMs?: number }) => {
    const {entity} = useEntity();


    return (

        <Routes>
            <Route
                path="/"
                element={
                    <CrossplaneAwsComponent
                        entity={entity}
                        refreshIntervalMs={props.refreshIntervalMs}
                    />
                }
            />
        </Routes>

    );
}
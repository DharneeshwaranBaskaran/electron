import React, { lazy, Suspense } from "react";
import Cookies from "js-cookie";
const Sellerview = lazy(() => import("../components/homepage/sellerview"));
const Delivery = lazy(() => import("../pages/status/deliverystatus"));
const FeatureFlags = {
    iscsvaccess: () => {
        if (Cookies.get('type') === 'company') {
            return true;
        }
        else {
            return false;
        }
    },
    ishome: () => {
        if (Cookies.get('type') === 'company' || Cookies.get('type') === 'seller') {
            return <Sellerview />;
        }
        else {
            return <Delivery />
        }



    }
};

export default FeatureFlags;
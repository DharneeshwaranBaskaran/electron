import React, { lazy, Suspense } from "react";
import '../../App.css';
import Cookies from 'js-cookie';
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useLoginContext } from "../../usercontext/UserContext";
import Skeleton from "./skeleton_home";
import { Helper } from "../../components/helper/helpers";
import "./homepage.css"
import FeatureFlags from "../../featureflag/featureflag";

function HomePage() {
  const { jwt, setjwt } = useLoginContext();
  return (
    <div className="backgroundhome">
      {(jwt == Cookies.get('token') && Cookies.get('type') == Helper(jwt).type && Helper(jwt).id == Cookies.get("dataid")) && (
        <Suspense fallback={<Skeleton />}> 
              {FeatureFlags.ishome()} 
         
        </Suspense>
      )}
    </div>
  );
}
export default withLogoutHandler(HomePage);

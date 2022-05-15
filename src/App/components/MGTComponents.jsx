import React, { useEffect, useState } from "react";
import { Providers, ProviderState } from "@microsoft/mgt";
import {
  Agenda,
  Todo,
  Person,
  PeoplePicker,
  PersonViewType,
  PersonCardInteraction,
} from "@microsoft/mgt-react";

function useIsSignedIn() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    const updateState = () => {
      const provider = Providers.globalProvider;
      setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
    };
    Providers.onProviderUpdated(updateState);
    updateState();
    return () => {
      Providers.removeProviderUpdatedListener(updateState);
    };
  }, []);
  return [isSignedIn];
}
// TeamsProvider.microsoftTeamsLib = microsoftTeams;

export function AgendaComp() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // eslint-disable-next-line
  const [isSignedIn] = useIsSignedIn();
  return (
    <Agenda className='Dashboard_Task' preferredTimezone={timezone} days={1} />
  );
}
// export function TodoList() {
//   // eslint-disable-next-line
//   const [isSignedIn] = useIsSignedIn();
//   return <Tasks className='Dashboard_Task' />;
// }

export function PersonalTodo() {
  
  
  return (
    <Todo style={{backgroundColor: "transparent"}}></Todo>
  );

}

export function PeoplePickerComp({ whichPassDown, mode, passedDown }) {
  // eslint-disable-next-line
  const [isSignedIn] = useIsSignedIn();
  let choice = "";

  if (mode !== undefined) {
    choice = "single";
  } else {
    choice = "multiple";
  }
  let userType = "user";
  if (whichPassDown !== undefined) {
    userType = "user";
  }
  return (
    <div className='PeoplePickerWrapper'>
      <div className='PeoplePickerInputWrapper'>
        <PeoplePicker
          userType={userType}
          selectionChanged={passedDown}
          selectionMode={choice}
        ></PeoplePicker>
      </div>
    </div>
  );
}
export function PersonWithDetails(props) {
  return (
    <Person
      personQuery={props.email}
      view={PersonViewType.twolines}
      showPresence={true}
      line1Property='givenName'
      personCardInteraction={PersonCardInteraction.hover}
    ></Person>
  );
}

// const PersonTemplate = (props) => {
//   const person = props.dataContext;
//   return <div>
//     {person.userPrincipalName}
//     {/* <Person userId={person.userPrincipalName}  fetchImage={true} showPresence={true}
//        line2Property="mail"></Person> */}
//   </div>;
// };

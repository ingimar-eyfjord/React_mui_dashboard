import React from "react";
import { styled } from "@mui/material/styles";
import CardBody from "App/components/Card/CardBody.js";
import Cards from "App/components/Card/Card.js";
import CardHeader from "App/components/Card/CardHeader.js";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import { Link } from "@mui/material";
import styles from "App/components/classes";
import { makeStyles } from "@material-ui/styles";
import {
  Get,
  Person,
  PersonViewType,
  PersonCardInteraction,
} from "@microsoft/mgt-react";
import "simplebar/dist/simplebar.min.css";
// import { useMaterialUIController } from "context";
const useStyles = makeStyles(styles);

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));


export default function Emails() {
  const classes = useStyles();
  const MyEvent = (props) => {
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
    const email = props.dataContext;
    if (email.inferenceClassification === "focused") {
      return (
        <Cards
          sx={{
            backgroundColor: "transparent !important",
            margin: "auto",
            marginBottom: "0.5rem",
          }}
        >
          <CardHeader>
            <Person
              personCardInteraction={PersonCardInteraction.hover}
              showPresence={true}
              line2Property='mail'
              view={PersonViewType.twolines}
              personQuery={email.sender.emailAddress.address}
              className={classes.cardEmailContainerDark}
            ></Person>
          </CardHeader>
          <CardBody>
            <h3 className={classes.cardTitle}>{email.subject}</h3>
            <p style={{marginTop:"1rem"}}>{moment(email.receivedDateTime).format("DD-MM-YYY HH:mm")}</p>
            <h3 style={{marginTop:"1rem"}} className={classes.cardCategory}>
              {email.bodyPreview ? (
                <Link
                  target='_blank'
                  rel='noreferrer'
                  href={email.webLink}
                  data-for='email in value'
                  style={{color:"black !important"}}
                >
                  {email.bodyPreview.substring(0, 150)} .....
                </Link>
              ) : (
                <Link
                  target='_blank'
                  rel='noreferrer'
                  href={email.webLink}
                  data-for='email in value'
                  className={classes.cardCategory}
                  style={{color:"black !important"}}
                >
                  email body is empty
                </Link>
              )}
            </h3>
          </CardBody>
          <CardActions disableSpacing>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label='show more'
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout='auto' unmountOnExit>
            <CardBody>
              <div
                dangerouslySetInnerHTML={{ __html: email.body.content }}
              ></div>
            </CardBody>
          </Collapse>
        </Cards>
      );
    } else {
      return null;
    }
  };

  // useEffect(() => {
  //   const current = darkModeRef.current;
  //   if (current !== undefined) {
  //     if (darkMode) {
  //       current.className = classes.cardCategoryWhite;
  //     } else {
  //       current.className = classes.cardCategory;
  //     }
  //   }
  // }, [darkMode,classes]);

  return (
    <Get
        resource='/me/mailFolders/inbox/messages?$filter=isRead eq false'
        version='beta'
        scopes={["mail.read"]}
        max-pages='1'
      >
        <MyEvent
          template='value'
          style={{ width: "98%", color: "white !important" }}
        />
      </Get>
  );
}

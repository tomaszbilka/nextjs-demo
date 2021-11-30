import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>React MeatUps</title>
        <meta
          name='description'
          content='Browse a list of active React meetups'
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
};

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   //fetch data from an API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export async function getStaticProps() {
  //fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://admin:admin@nextjs.lkgt2.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("mymeetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((el) => ({
        title: el.title,
        address: el.address,
        image: el.image,
        description: el.description,
        id: el._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;

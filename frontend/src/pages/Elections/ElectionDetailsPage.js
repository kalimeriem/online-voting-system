import React from 'react';
import { useParams } from 'react-router-dom';
import { getElections } from '../..api//repositories/ElectionRepository';
import UserElectionDetails from './UserElectionDetails';
import AdminElectionPanel from './AdminElectionPanel';

const ElectionDetailsPage = ({ user }) => {
  const { id } = useParams();
  const election = getElections().find(e => e.id === Number(id));
  if (!election) return <div>Election not found.</div>;
  return election.creator === user.email ? (
    <AdminElectionPanel election={election} user={user} />
  ) : (
    <UserElectionDetails election={election} user={user} />
  );
};

export default ElectionDetailsPage;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getElectionsFromAPI } from '../../api/repositories/ElectionRepository';
import UserElectionDetails from './UserElectionDetails';
import AdminElectionPanel from './AdminElectionPanel';

const ElectionDetailsPage = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user')) || { email: 'john@example.com' };
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const elections = await getElectionsFromAPI();
        const found = elections.find(e => e.id === Number(id));
        setElection(found);
      } catch (err) {
        console.error("Failed to fetch election:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchElection();
  }, [id]);

  if (loading) return <div>Loading election...</div>;
  if (!election) return <div>Election not found.</div>;

  const isCreator = election.creator === user.email;
  
  return isCreator ? (
    <AdminElectionPanel election={election} user={user} />
  ) : (
    <UserElectionDetails election={election} user={user} />
  );
};

export default ElectionDetailsPage;
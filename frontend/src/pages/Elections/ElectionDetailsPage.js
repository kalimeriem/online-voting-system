import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getElectionsFromAPI } from '../../api/repositories/ElectionRepository';
import UserElectionDetails from './UserElectionDetails';
import AdminElectionPanel from './AdminElectionPanel';
import ElectionResults from './ElectionResults';

const ElectionDetailsPage = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user')) || { email: 'john@example.com' };
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to compute election status
  const computeStatus = (election) => {
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (now < startDate) return 'UPCOMING';
    if (now > endDate) return 'ENDED';
    return 'ACTIVE';
  };

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const elections = await getElectionsFromAPI();
        let found = elections.find(e => e.id === Number(id));
        if (found) {
          // Compute proper status based on dates
          found = { ...found, status: computeStatus(found) };
        }
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
  const isEnded = election.status === 'ENDED';
  
  // Show results if election has ended or if user is creator and wants to see live results
  if (isEnded || (isCreator && election.status !== 'UPCOMING')) {
    return <ElectionResults election={election} user={user} />;
  }

  return isCreator ? (
    <AdminElectionPanel election={election} user={user} />
  ) : (
    <UserElectionDetails election={election} user={user} />
  );
};

export default ElectionDetailsPage;
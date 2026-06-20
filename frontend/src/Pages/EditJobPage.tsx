import { useParams } from "react-router-dom";
import PostJob from "../PostJob/PostJob";

const EditJobPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-[90vh] bg-mine-shaft-950 font-[Poppins] p-6">
      <PostJob jobId={Number(id)} />
    </div>
  );
};

export default EditJobPage;

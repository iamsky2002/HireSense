import { Button, Divider } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";


const JobDescPage = () => {
    return (
        <div className="min-h-[90vh] bg-mine-shaft-950 font-['poppins'] p-4">
            <Divider size="xs" mx="md" />
            <Link className="my-5 inline-block" to="/find-jobs">
                <Button color="brightSun.4" leftSection={<IconArrowLeft size={20} />} variant="light">Back</Button>
            </Link>
            <div className="flex gap-5">
            </div>
        </div>
    )
}

export default JobDescPage;

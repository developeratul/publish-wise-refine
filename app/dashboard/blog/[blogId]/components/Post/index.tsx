import DevToLogo from "@/assets/logos/dev-to.png";
import HashNodeLogo from "@/assets/logos/hashnode.png";
import MediumLogo from "@/assets/logos/medium.png";
import Icon from "@/components/Icon";
import { Button, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import DevToPostModal from "./Dev.to";
import HashNodePublishModal from "./Hashnode";
import MediumPublishModal from "./Medium";

export default function PublishBlog() {
  const [devToModalOpened, { open: openDevToModal, close: closeDevToModal }] = useDisclosure(false);
  const [hashNodeModalOpened, { open: openHashNodeModal, close: closeHashNodeModal }] =
    useDisclosure(false);
  const [mediumModalOpened, { open: openMediumModal, close: closeMediumModal }] =
    useDisclosure(false);

  return (
    <div>
      <Menu>
        <Menu.Target>
          <Button rightIcon={<Icon name="IconChevronDown" />}>Publish / Republish</Button>
        </Menu.Target>
        <Menu.Dropdown miw={200}>
          <Menu.Item
            onClick={openDevToModal}
            icon={<Image width={25} src={DevToLogo} alt="Dev.to logo" />}
          >
            Dev.to
          </Menu.Item>
          <Menu.Item
            onClick={openHashNodeModal}
            icon={<Image width={25} src={HashNodeLogo} alt="Hashnode logo" />}
          >
            Hashnode
          </Menu.Item>
          <Menu.Item
            onClick={openMediumModal}
            icon={<Image width={25} src={MediumLogo} alt="Medium logo" />}
          >
            Medium
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <DevToPostModal opened={devToModalOpened} close={closeDevToModal} />
      <HashNodePublishModal opened={hashNodeModalOpened} close={closeHashNodeModal} />
      <MediumPublishModal opened={mediumModalOpened} close={closeMediumModal} />
    </div>
  );
}

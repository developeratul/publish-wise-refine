import PublishModalWrapper, { ModalProps } from "./modal-wrapper";

export default function MediumPublishModal(props: ModalProps) {
  const { opened, close } = props;
  return (
    <PublishModalWrapper opened={opened} close={close} title="Medium">
      <p>Publishing details</p>
    </PublishModalWrapper>
  );
}

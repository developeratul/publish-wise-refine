import PublishModalWrapper, { ModalProps } from "./modal-wrapper";

export default function HashNodePublishModal(props: ModalProps) {
  const { opened, close } = props;
  return (
    <PublishModalWrapper opened={opened} close={close} title="Hashnode">
      <p>Publishing details</p>
    </PublishModalWrapper>
  );
}

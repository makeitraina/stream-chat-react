import React, { useCallback } from 'react';

import { MessageSimple } from './MessageSimple';
import {
  ActionHandlerReturnType,
  useActionHandler,
  useDeleteHandler,
  useEditHandler,
  useFlagHandler,
  useMentionsHandler,
  useMuteHandler,
  useOpenThreadHandler,
  usePinHandler,
  useReactionHandler,
  useRetryHandler,
  useUserHandler,
  useUserRole,
} from './hooks';
import {
  areMessagePropsEqual,
  defaultPinPermissions,
  getMessageActions,
  MESSAGE_ACTIONS,
} from './utils';

import { RetrySendMessage, useChannelActionContext } from '../../context/ChannelActionContext';
import { useChannelStateContext } from '../../context/ChannelStateContext';

import type { Channel } from 'stream-chat';

import type { MessageProps, MouseEventHandler } from './types';

import type {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultCommandType,
  DefaultEventType,
  DefaultMessageType,
  DefaultReactionType,
  DefaultUserType,
} from '../../../types/types';

type MessageWithContextProps<
  At extends DefaultAttachmentType = DefaultAttachmentType,
  Ch extends DefaultChannelType = DefaultChannelType,
  Co extends DefaultCommandType = DefaultCommandType,
  Ev extends DefaultEventType = DefaultEventType,
  Me extends DefaultMessageType = DefaultMessageType,
  Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
> = MessageProps<At, Ch, Co, Ev, Me, Re, Us> & {
  canPin: boolean;
  channel: Channel<At, Ch, Co, Ev, Me, Re, Us>;
  handleAction: ActionHandlerReturnType;
  handleDelete: MouseEventHandler;
  handleFlag: MouseEventHandler;
  handleMute: MouseEventHandler;
  handleOpenThread: MouseEventHandler;
  handlePin: MouseEventHandler;
  handleReaction: (
    reactionType: string,
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => Promise<void>;
  handleRetry: RetrySendMessage<At, Ch, Co, Ev, Me, Re, Us>;
  onMentionsClickMessage: MouseEventHandler;
  onMentionsHoverMessage: MouseEventHandler;
  userRoles: {
    canDeleteMessage: boolean;
    canEditMessage: boolean;
    isAdmin: boolean;
    isModerator: boolean;
    isMyMessage: boolean;
    isOwner: boolean;
  };
};

const MessageWithContext = <
  At extends DefaultAttachmentType = DefaultAttachmentType,
  Ch extends DefaultChannelType = DefaultChannelType,
  Co extends DefaultCommandType = DefaultCommandType,
  Ev extends DefaultEventType = DefaultEventType,
  Me extends DefaultMessageType = DefaultMessageType,
  Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
>(
  props: MessageWithContextProps<At, Ch, Co, Ev, Me, Re, Us>,
) => {
  const {
    canPin,
    channel,
    formatDate,
    groupStyles = [],
    Message: MessageUIComponent = MessageSimple,
    message,
    messageActions = Object.keys(MESSAGE_ACTIONS),
    onMentionsClickMessage,
    onMentionsHoverMessage,
    onUserClick: propOnUserClick,
    onUserHover: propOnUserHover,
    userRoles,
  } = props;

  const channelConfig = channel.getConfig && channel.getConfig();

  const { clearEdit, editing, setEdit } = useEditHandler();

  const { onUserClick, onUserHover } = useUserHandler(message, {
    onUserClickHandler: propOnUserClick,
    onUserHoverHandler: propOnUserHover,
  });

  const { isAdmin, isModerator, isMyMessage, isOwner } = userRoles;

  const canEdit = isMyMessage || isModerator || isOwner || isAdmin;
  const canDelete = canEdit;
  const canReact = true;
  const canReply = true;

  const messageActionsHandler = useCallback(() => {
    if (!message || !messageActions) {
      return [];
    }

    return getMessageActions(messageActions, {
      canDelete,
      canEdit,
      canFlag: !isMyMessage,
      canMute: !isMyMessage && !!channelConfig?.mutes,
      canPin,
      canReact,
      canReply,
    });
  }, [
    canDelete,
    canEdit,
    canPin,
    canReply,
    canReact,
    channelConfig?.mutes,
    isMyMessage,
    message,
    messageActions,
  ]);

  const actionsEnabled = message.type === 'regular' && message.status === 'received';

  return (
    <MessageUIComponent
      {...props}
      actionsEnabled={actionsEnabled}
      channelConfig={channelConfig}
      clearEditingState={clearEdit}
      editing={editing}
      formatDate={formatDate}
      getMessageActions={messageActionsHandler}
      groupStyles={groupStyles}
      handleEdit={setEdit}
      isMyMessage={() => isMyMessage}
      onMentionsClickMessage={onMentionsClickMessage}
      onMentionsHoverMessage={onMentionsHoverMessage}
      onUserClick={onUserClick}
      onUserHover={onUserHover}
      setEditingState={setEdit}
    />
  );
};

const MemoizedMessage = React.memo(
  MessageWithContext,
  areMessagePropsEqual,
) as typeof MessageWithContext;

/**
 * Message - A high level component which implements all the logic required for a Message.
 * The actual rendering of the Message is delegated via the "Message" property.
 * @example ./Message.md
 */
export const Message = <
  At extends DefaultAttachmentType = DefaultAttachmentType,
  Ch extends DefaultChannelType = DefaultChannelType,
  Co extends DefaultCommandType = DefaultCommandType,
  Ev extends DefaultEventType = DefaultEventType,
  Me extends DefaultMessageType = DefaultMessageType,
  Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
>(
  props: MessageProps<At, Ch, Co, Ev, Me, Re, Us>,
) => {
  const {
    channel: propChannel,
    getFlagMessageErrorNotification,
    getFlagMessageSuccessNotification,
    getMuteUserErrorNotification,
    getMuteUserSuccessNotification,
    getPinMessageErrorNotification,
    message,
    onMentionsClick: propOnMentionsClick,
    onMentionsHover: propOnMentionsHover,
    openThread: propOpenThread,
    pinPermissions = defaultPinPermissions,
    retrySendMessage: propRetrySendMessage,
  } = props;

  const { addNotification } = useChannelActionContext<At, Ch, Co, Ev, Me, Re, Us>();
  const { channel: contextChannel } = useChannelStateContext<At, Ch, Co, Ev, Me, Re, Us>();

  const channel = propChannel || contextChannel;

  const handleAction = useActionHandler(message);
  const handleDelete = useDeleteHandler(message);
  const handleOpenThread = useOpenThreadHandler(message, propOpenThread);
  const handleReaction = useReactionHandler(message);
  const handleRetry = useRetryHandler(propRetrySendMessage);
  const userRoles = useUserRole(message);

  const handleFlag = useFlagHandler(message, {
    getErrorNotification: getFlagMessageErrorNotification,
    getSuccessNotification: getFlagMessageSuccessNotification,
    notify: addNotification,
  });

  const handleMute = useMuteHandler(message, {
    getErrorNotification: getMuteUserErrorNotification,
    getSuccessNotification: getMuteUserSuccessNotification,
    notify: addNotification,
  });

  const { onMentionsClick, onMentionsHover } = useMentionsHandler(message, {
    onMentionsClick: propOnMentionsClick,
    onMentionsHover: propOnMentionsHover,
  });

  const { canPin, handlePin } = usePinHandler(message, pinPermissions, {
    getErrorNotification: getPinMessageErrorNotification,
    notify: addNotification,
  });

  return (
    <MemoizedMessage
      {...props}
      canPin={canPin}
      channel={channel}
      handleAction={handleAction}
      handleDelete={handleDelete}
      handleFlag={handleFlag}
      handleMute={handleMute}
      handleOpenThread={handleOpenThread}
      handlePin={handlePin}
      handleReaction={handleReaction}
      handleRetry={handleRetry}
      onMentionsClickMessage={onMentionsClick}
      onMentionsHoverMessage={onMentionsHover}
      userRoles={userRoles}
    />
  );
};

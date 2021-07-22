import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text, Flex, CopyIcon, Button, Link } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { getCakeAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'

const CardImage = styled.img`
  width: 60px;
  height: auto;
  margin-right: 20px;
`

const TokenWrapper = styled.div`
  @media only screen and (min-width: 768px) {
    display: flex;
    flex-direction: row;
    text-align: center;
    justify-content: center;
  }
`

const TokenAddressWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const TokenAccountWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  cursor: pointer;
  padding: 5px;
`

const TokenAccount = styled.div`
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 40%;
  color: #0080FF;
  margin-left: 10px;

  @media only screen and (min-width: 375px) {
    width: 50%;
  }

  @media only screen and (min-width: 425px) {
    width: 60%;
  }

  @media only screen and (min-width: 768px) {
    width: 100%;
  }

  @media only screen and (min-width: 1024px) {
    width: 100%;
  }
`

const StyleButton = styled(Text).attrs({ role: 'button' })`
  position: relative;
  display: flex;
  line-height: unset !important;
`

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'block' : 'none')};
  position: absolute;
  bottom: -29px;
  right: 0;
  left: 0;
  text-align: center;
  background-color: white;
  color: black;
  border-radius: 16px;
  opacity: 0.7;
  padding: 5px;
  width: 45%;

  @media only screen and (min-width: 375px) {
    width: 55%;
  }

  @media only screen and (min-width: 425px) {
    width: 65%;
  }

  @media only screen and (min-width: 768px) {
    width: 100%;
  }

  @media only screen and (min-width: 1024px) {
    width: 60%;
  }
`

const ActionsButtonWrapper = styled.div`
  margin-top: 20px;
  text-align: center;

  button {
    width: 100%;
  }

  p {
    margin-top: 10px;
  }

  a {
    display: inline-block;
    width: 100%;

    :hover {
      text-decoration: none;
    }
  }
`

const BuyWrapper = styled.div`
  margin-top: 20px;
`

const AddMartianIcon = styled.img`
  width: 108px;
  height: auto;
  margin-bottom: 11px;
`

const ButtonIcon = styled.img`
  width: 34px;
  height: 34px;
`

const AddMartianCard = () => {
  const TranslateString = useI18n()
  const tokenAddress = getCakeAddress()
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)
  const [addMartianDisabled, setAddMartianDisabled] = useState(false)

  const handleAddMartian = useCallback(async () => {
    const windowAsAny = window as any
    if (typeof windowAsAny.ethereum === 'undefined' && !windowAsAny.ethereum.isMetaMask) {
      console.error('MetaMask is not installed!')
    }

    setAddMartianDisabled(true)

    const tokenSymbol = 'SWORD'
    const tokenDecimals = 18
    const tokenImage = `${process.env.REACT_APP_BASE_URL}/images/egg/9.png`

    try {
      const wasAdded = await windowAsAny.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      })
    } catch (error) {
      console.error(error)
    } finally {
      setAddMartianDisabled(false)
    }
  }, [tokenAddress])

  return (
    <Card>
      <CardBody>
        <Heading size="lg" mb="24px" style={{ textAlign: 'center' }}>
          {TranslateString(10015, 'Add SWORD')}
        </Heading>
        <div style={{ textAlign: 'center' }}>
          <AddMartianIcon src="/images/add_martian.png" alt="add logo" />
        </div>
        <TokenWrapper>
          <TokenAddressWrapper>
            <p>{TranslateString(10016, 'Token Address')}</p>
            <TokenAccountWrapper>
              <StyleButton
                small
                bold
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(tokenAddress)
                    setIsTooltipDisplayed(true)
                    setTimeout(() => {
                      setIsTooltipDisplayed(false)
                    }, 1000)
                  }
                }}
              >
                <CopyIcon width="18px" />
                <TokenAccount>{tokenAddress}</TokenAccount>
                <Tooltip isTooltipDisplayed={isTooltipDisplayed}>Copied</Tooltip>
              </StyleButton>
            </TokenAccountWrapper>
          </TokenAddressWrapper>
        </TokenWrapper>
        <ActionsButtonWrapper>
          <div>
            <Button variant="primary" disabled={addMartianDisabled} onClick={handleAddMartian}>
              {TranslateString(10017, 'Add $SWORD to')}&nbsp;
              <ButtonIcon src="/images/metamask.png" alt="metamask logo" />
            </Button>
          </div>
          <BuyWrapper style={{ textAlign: 'center' }}>
            <Link external href={`https://exchange.pancakeswap.finance/#/swap?outputCurrency=${tokenAddress}`}>
              <Button variant="primary">
                {TranslateString(10018, 'Buy $SWORD token')}&nbsp;
                <ButtonIcon src="/images/pancake.png" alt="pancake logo" />
              </Button>
            </Link>
            <p style={{ paddingTop: '5px' }}>{TranslateString(10019, 'Remember set Slippage to at least 5')}%</p>
          </BuyWrapper>
        </ActionsButtonWrapper>
      </CardBody>
    </Card>
  )
}

export default AddMartianCard
